const { program } = require('commander');
const api = require('./api');

// todo otp 登录
// todo 导出特定 page
// todo 捕获接口参数错误
// todo cli 文件
const exportService = async (opts = {}) => {
    const {
        email,
        password,
        spaceId,
        blockId,
        exportType,
    } = opts;

    await api.login(email, password);

    const { taskId } = blockId ?
        await api.launchExportBlockTask(spaceId, blockId, exportType) :
        await api.launchExportSpaceTask(spaceId, exportType);

    let timer = null;

    const timerFn = async (resolve) => {
        const statusInfo = await api.getUserTaskStatus(taskId);

        clearTimeout(timer);

        if (statusInfo.state === 'in_progress') {
            timer = setTimeout(() => timerFn(resolve), 3000);
        } else {
            resolve(statusInfo.status.exportURL);
        }
    }

    const exportUrl = await new Promise(timerFn);

    return exportUrl;
};

module.exports = exportService;