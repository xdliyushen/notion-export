const api = require('./api');

const getExportUrl = (taskId) => {
    const tick = async (resolve, reject) => {
        try {
            const statusInfo = await api.getUserTaskStatus(taskId);
            if (statusInfo.state === 'success') {
                resolve(statusInfo?.status?.exportURL);
            } else {
                const timer = setTimeout(() => {
                    tick(resolve, reject);
                    clearTimeout(timer);
                }, 3000);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    }

    return tick;
}

const exportService = async (opts = {}) => {
    try {
        const {
            email,
            password,
            blockId,
            exportType = 'markdown',
        } = opts;
        const exportUrls = [];

        await api.login(email, password);
        console.log('login success!');

        const spaceId = await api.getSpaces();
        console.log(`get spaces success! spaceId: ${spaceId}`);

        const blockIds = Array.isArray(blockId) ? blockId : [blockId];

        for (const targetBlockId of blockIds) {
            const { taskId } = await api.launchExportTask(spaceId, targetBlockId, exportType)
            console.log(`task launched! taskId: ${taskId}`);

            const exportUrl = await new Promise(getExportUrl(taskId));
            console.log(`export success! export url: ${exportUrl}`);

            exportUrls.push(exportUrl);
        }

        return exportUrls;
    } catch (err) {
        console.log(err);
        return [''];
    }
};

module.exports = exportService;
