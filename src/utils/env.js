export const isHMR = () => process.env.NODE_ENV === 'development';

export const isRunOnProductionBuild = () => !isHMR() && process.env.BUILD_CI_BRANCH === 'master';
