export default {
  branches: ['main', 'master', 'next'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
