export async function fetchEarthquakes(type, period) {
  const url = 'localhost:3000/proxy?period=hour&type=significant';
  // TODO sækja gögn frá proxy þjónustu
  app.use('/proxy', proxyRouter);

  try {
    result = await fetch(proxyRouter);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
