/* eslint-disable no-console */
// TODO útfæra proxy virkni
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config;

export const router = express.Router();

const {
  API_URL: api_url,
} = process.env;

async function getEarthquakes(req, res) {
  const { type, period } = req.query;
  const url = new URL( type + '_' + period + '.geojson', api_url).href;
  const response = await fetch(url);
  console.log('GET response status:', response.status);
  const text = await response.json();
  console.log('Get resoinse json:', text);
}

router.get('/proxy', getEarthquakes);