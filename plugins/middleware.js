import configService from '@/common/service/config.service.js';

import { setConfig } from '@/uni_modules/hf-middleware';

setConfig({
	usedApi: configService.usedApi,
	usedConfig: configService.usedConfig
});
