import { Request, Response } from 'express';
import shortid from 'shortid';
import Url from '../models/urlModel';
import { validateUrl } from '../utils/validateUrl';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body;
    console.log('Original URL received:', originalUrl);

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'URL is required' 
      });
    }

    if (!validateUrl(originalUrl)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid URL format' 
      });
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.json({
        success: true,
        shortUrl: `${BASE_URL}/${existingUrl.shortCode}`,
        originalUrl: existingUrl.originalUrl,
        expiresAt: existingUrl.expiresAt,
        createdAt: existingUrl.createdAt,
        message: 'Existing shortened URL found'
      });
    }

    // Create new short URL
    const shortCode = shortid.generate();
    console.log("fkldfjsldkj")
    console.log(shortCode)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration
    console.log('New URL will expire on:', expiresAt);

    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiresAt,
      clicks: 0,
      clickData: []
    });

    await newUrl.save();

    // Return complete response
    return res.status(201).json({
      success: true,
      shortUrl: `${BASE_URL}/${newUrl.shortCode}`,
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
      expiresAt: newUrl.expiresAt,
      createdAt: newUrl.createdAt,
      message: 'URL successfully shortened'
    });

  } catch (error) {
    // Error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Shorten URL Error:', errorMessage);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: errorMessage 
    });
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).render('error', { 
        message: 'URL not found',
        status: 404
      });
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      await Url.deleteOne({ _id: url._id });
      return res.status(410).render('error', {
        message: 'This URL has expired and been removed',
        status: 410
      });
    }

    url.clicks += 1;
    url.clickData.push({
      timestamp: new Date(),
      ip: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      referrer: req.headers.referer || 'direct'
    });

    await url.save();

    res.setHeader('Cache-Control', 'no-store');
    res.redirect(301, url.originalUrl);

  } catch (error) {
    console.error('Redirect Error:', error);
    res.status(500).render('error', {
      message: 'Internal server error',
      status: 500
    });
  }
};

export const getUrlStats = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${BASE_URL}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });
    
    if (!url) return res.status(404).json({ error: 'URL not found' });

    // Define type for devices count
    interface DeviceCounts {
      mobile: number;
      desktop: number;
      [key: string]: number; // Index signature for dynamic properties
    }

    // Initialize accumulator with proper type
    const initialCounts: DeviceCounts = { mobile: 0, desktop: 0 };
    
    const devices = url.clickData.reduce((acc: DeviceCounts, click) => {
      if (!click.userAgent) return acc;
      
      const device = /mobile/i.test(click.userAgent) ? 'mobile' : 'desktop';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, initialCounts);

    res.json({
      totalClicks: url.clicks,
      clicksLast24h: url.clickData.filter(click => 
        click.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      devices,
      timeline: url.clickData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};