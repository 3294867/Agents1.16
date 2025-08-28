import constants from '../../constants';

const isUuidV4 = (str: string): boolean => constants.regex.UUID_V4.test(str);

export default isUuidV4;