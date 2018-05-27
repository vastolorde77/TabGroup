inElement = document.getElementById("thing");
orderButton = document.getElementById("orderBut")
orderButton.addEventListener('click', (e) => {
    gather(order);
})
document.addEventListener('keypress', (e) => gather(order))
// inElement.addEventListener('keypress',(e) => {
//     if(e.key === "Enter" && inElement.value) place(inElement.value);
// })


// window.onload = () => {
//     // gather(order);
    // chrome.tabs.query({currentWindow: true, active : true}, (tabs) => {
    //     url = getDomain(tabs[0].url)
    //     chrome.tabs.query({currentWindow : true }, (tabs) => {
    //         index = []
    //         tabs = tabs.filter( tab => getDomain(tab.url) === url);
    //         tabs.forEach( tab => index.push(tab.index));
    //         chrome.tabs.highlight({'tabs' : index}, ()=>{});
    //     })

//     })
    
// }




getDomain = (url) => new URL(url).hostname

orderLex = (tabs) => {
    tabs = Object.keys(tabs).sort();
    temp = {}
    for(let i = 0;i < tabs.length;i++){
        temp[tabs[i]] = 1;
    }
    return temp;
}

gather = (order) => {
    dic = {}
    chrome.tabs.query({ currentWindow: true },  (tabs) => {
        tabs.forEach( tab => {
            // console.log(tab.url.substr(0,tab.url.indexOf("/",8)));
            dic[getDomain(tab.url)] = 1;
        });
        dic = orderLex(dic)
        order(dic,tabs);
    });
} 


order = (dic,tabs) => {
    console.log(dic);
    for(i in dic) place(i,tabs);
    window.close();
}

place = (replaceURL,tabs) => {
// chrome.tabs.query({ currentWindow: true }, function (tabs) {
    // console.log(replaceURL);
    tabs.forEach(element => {
        // console.log(element.url.includes(replaceURL));
        cur_url = getDomain(element.url)
        if(cur_url.match(replaceURL))chrome.tabs.move(element.id, {index:-1})
    });
//   });
}
