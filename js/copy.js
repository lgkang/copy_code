
const replaceCopyText =  function (e) {
    // clipboardData 对象是为通过编辑菜单、快捷菜单和快捷键执行的编辑操作所保留的，也就是你复制或者剪切内容
    let clipboardData = e.clipboardData || window.clipboardData;
    // 如果 未复制或者未剪切，直接 return
    if (!clipboardData) return;
    // Selection 对象 表示用户选择的文本范围或光标的当前位置。
    // 声明一个变量接收 -- 用户输入的剪切或者复制的文本转化为字符串
    let text = window.getSelection().toString();
    if (text) {
        // 如果文本存在，首先取消默认行为
        e.preventDefault();
        // 通过调用 clipboardData 对象的 setData(format,data) 方法，设置相关文本
        // format 一个 DOMString 类型 表示要添加到 drag object 的拖动数据的类型
        // data 一个 DOMString 表示要添加到 drag object 的数据
        clipboardData.setData('text/plain', text)
    }
}ba

const cancelCopyText = function() {
    document.addEventListener('copy', replaceCopyText);
    window.cancelCopyTextStatus = true;
}

const removeCancelCopyText = function() {
    document.removeEventListener('copy', replaceCopyText);
    window.cancelCopyTextStatus = false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const html = document.querySelector('html');
    switch (request) {
        case 'get_editable':
            sendResponse(html.getAttribute('contentEditable'));
            break;
        case 'open':
            // 将当前文档是否可编辑的信息返回给popup，控制开关的形态
            html.setAttribute('contentEditable', "true");
            break;
        case 'close':
            html.removeAttribute('contentEditable');
            break;
        case 'get_cancel_copy':

            sendResponse(window.cancelCopyTextStatus || false)
            break;
        case 'open_cancel_copy_text':
            cancelCopyText();
            break;
        case 'close_cancel_copy_text':
            removeCancelCopyText();
            break;
        default:
            break;
    }
})
