
document.addEventListener('DOMContentLoaded', function () {
    // 切换contentEditable状态
    const toggle = document.getElementById('toggle');
    const cancel = document.getElementById('cancel');


    sendMessageToContentScript('get_cancel_copy', status => {
        cancel.checked = !!status
    })

    cancel.addEventListener('change', (e) => {
        const status = e.target.checked ? 'open_cancel_copy_text' : 'close_cancel_copy_text';
        sendMessageToContentScript(status);
    });

    sendMessageToContentScript('get_editable', status => {
        toggle.checked = status === 'true'
    })

    toggle.addEventListener('change', (e) => {
        const status = e.target.checked ? 'open' : 'close';
        sendMessageToContentScript(status);
    });
});

function sendMessageToContentScript(status, cb = () => {}) {
    // 这里用到了tabs，所以前面配置文件需要配置"permissions": ["tabs"]
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, status, status => cb(status));
    });
}

