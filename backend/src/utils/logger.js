const serialize = (message, meta) => {
  const payload = {
    timestamp: new Date().toISOString(),
    message,
    ...meta
  };
  return JSON.stringify(payload);
};

const log = (level, message, meta = {}) => {
  const output = serialize(message, { level, ...meta });
  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
};

export default {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, meta);
    }
  }
};
