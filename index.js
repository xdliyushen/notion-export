const api = require('./api');

const getExportUrl = (taskId) => {
    const tick = async (resolve, reject) => {
        try {
            const statusInfo = await api.getUserTaskStatus(taskId);
            if (statusInfo.state === 'in_progress') {
                const timer = setTimeout(() => {
                    tick(resolve, reject);
                    clearTimeout(timer);
                }, 3000);
            } else {
                resolve(statusInfo.status.exportURL);
            }
        } catch(err) {
            console.log(err);
            reject(err);
        }
    }

    return tick;
}

// todo otp 登录
// todo 导出特定 page
const exportService = async (opts = {}) => {
    try {
        const {
            email,
            password,
            spaceId,
            blockId,
            exportType,
        } = opts;

        // todo 删除
        console.log(opts);

        await api.login(email, password);

        console.log('login success!')

        const { taskId } = blockId ?
            await api.launchExportBlockTask(spaceId, blockId, exportType) :
            await api.launchExportSpaceTask(spaceId, exportType);

        console.log(`task launched! taskId: ${taskId}`);

        const exportUrl = await new Promise(getExportUrl(taskId));

        console.log(`export success! export url: ${exportUrl}`);

        return exportUrl;
    } catch (err) {
        console.log(err);
        return '';
    }
};

module.exports = exportService;