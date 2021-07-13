module.exports = {
    reactStrictMode: true,
    target: 'serverless',
    images: {
        domains: ['source.unsplash.com', 'localhost', 'podboxx-production.s3.amazonaws.com', 'podboxx-development.s3.amazonaws.com', 'next.podboxx.com'],
    },
}