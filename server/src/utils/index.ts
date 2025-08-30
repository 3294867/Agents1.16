import encrypt from './encrypt';
import decrypt from './decrypt';
import updateSeedPasswords from './updateSeedPasswords';
import sendResponse from './sendResponse';
import inferAgentType from './inferAgentType';
import regex from './regex';
import validate from './validate';

const utils = {
  encrypt,
  decrypt,
  updateSeedPasswords,
  validate,
  regex,
  sendResponse,
  inferAgentType
};

export default utils;
