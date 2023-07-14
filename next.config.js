/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = config.externals.concat([
      "pg-hstore",
      "pg",
      "sqlite3",
      "sequelize",
    ]);
    return config;
  },
};

module.exports = nextConfig;
