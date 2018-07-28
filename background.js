chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case "order":
      sort_tabs(order);
      break;
    case "select":
      select();
      break;
    case "remove":
      remove_others();
      break;
    case "remove_same":
      remove_same();
    default:
      break;
  }
});

select = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    url = getDomain(tabs[0].url);
    chrome.tabs.query({ currentWindow: true }, tabs => {
      index = [];
      tabs = tabs.filter(tab => getDomain(tab.url) === url);
      console.log(tabs);
      tabs.forEach(tab => index.push(tab.index));
      tabs.forEach(tab => chrome.tabs.update(tab.id, { highlighted: true }));
      //chrome.tabs.highlight({'tabs' : index}, ()=>{});
    });
  });
};

getDomain = url => {
  let splitted = url.split(".");
  if (splitted.length > 2) return splitted[1];
  else return splitted[0];
};
remove_same = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    let cur_url = getDomain(tabs[0].url);
    chrome.tabs.query({ currentWindow: true }, tabs => {
      tabs = tabs.filter(tab => getDomain(tab.url) == cur_url);
      tabIds = tabs.map(tab => tab.id);
      chrome.tabs.remove(tabIds);
    });
  });
};

remove_others = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    let cur_url = getDomain(tabs[0].url);
    chrome.tabs.query({ currentWindow: true }, tabs => {
      tabs = tabs.filter(tab => getDomain(tab.url) != cur_url);
      tabIds = tabs.map(tab => tab.id);
      chrome.tabs.remove(tabIds);
    });
  });
};

order = tabs => {
  tabs = Object.keys(tabs).sort();
  temp = {};
  for (let i = 0; i < tabs.length; i++) {
    temp[tabs[i]] = 1;
  }
  return temp;
};

sort_tabs = order => {
  dic = {};
  chrome.tabs.query({ currentWindow: true }, tabs => {
    tabs.forEach(tab => {
      // console.log(tab.url.substr(0,tab.url.indexOf("/",8)));
      dic[getDomain(tab.url)] = 1;
    });
    dic = order(dic);
    order(dic, tabs);
  });
};

order = (dic, tabs) => {
  console.log(dic);
  for (i in dic) place(i, tabs);
  window.close();
};

place = (replaceURL, tabs) => {
  // chrome.tabs.query({ currentWindow: true }, function (tabs) {
  // console.log(replaceURL);
  tabs.forEach(element => {
    // console.log(element.url.includes(replaceURL));
    cur_url = getDomain(element.url);
    if (cur_url.match(replaceURL)) chrome.tabs.move(element.id, { index: -1 });
  });
  //   });
};
