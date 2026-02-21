/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nhle.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lscluster.hockeytech.com',
        pathname: '/feed/**',
      },
      {
        protocol: 'https',
        hostname: 'cluster.leaguestat.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.leaguestat.com',
        pathname: '/**/logos/**',
      },
      {
        protocol: 'https',
        hostname: '*.hockeytech.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.leaguestat.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.lscluster.hockeytech.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
