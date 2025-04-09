const Config = {
  DEBUG: process.env.DEBUG === 'true' ? true : false,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'BOT_TOKEN',
  TELEGRAM_OWNER_ID: Number.parseInt(process.env.TELEGRAM_OWNER_ID || '0') || 0,
};

export default Config;
