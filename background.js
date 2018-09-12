chrome.commands.onCommand.addListener(function(command) {
  let q = {
    windowTypes: ["normal"],
    populate: true
  };
  switch (command) {
    case "order":
      chrome.windows.getAll(q, windows => {
        windows.forEach(sort_window);
      });
      break;
    case "select":
      select();
      break;
    case "remove":
      remove_others();
      break;
    case "remove_same":
      remove_same();
      break;
    case "group_same_to_new_window":
      group_same_to_new_window();
    default:
      break;
  }
});

sort_window = window => {
  let dic = {};
  let tabs = window.tabs;
  tabs.forEach((tab) => {
    dic[getDomain(tab.url)] = 1;
  });
  dic = sort_indexes(dic);
  sort_tabs(dic, tabs);
};

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

sort_indexes = tabs => {
  tabs = Object.keys(tabs).sort();
  temp = {};
  for (let i = 0; i < tabs.length; i++) {
    temp[tabs[i]] = 1;
  }
  return temp;
};

sort_tabs = (index, tabs) => {
  for (i in index) place(i, tabs);
};

place = (replaceURL, tabs) => {
  tabs.forEach(element => {
    cur_url = getDomain(element.url);
    if (cur_url.match(replaceURL)) chrome.tabs.move(element.id, { index: -1 });
  });
};

group_same_to_new_window = () => {
  // chrome.windows.create((window) => {console.log(window)});
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    let url = tabs[0].url;
    // chrome.tabs.query({ currentWindow: true }, tabs => {
    //   tabs = tabs.filter(tab => getDomain(tab.url) === getDomain(url));
    //   tabs = tabs.map(tab => tab.id);
    //   console.log(tabs);
    //   chrome.windows.create((window) => {
    //     console.log(window.tabs);
    //     chrome.tabs.move(tabs,{windowId : window.id,index:-1});
    //     chrome.tabs.remove(window.tabs[0].id); // REMOVE NEW TAB PAGE
    //   });
    // });
    chrome.windows.create((root) => {
      chrome.windows.getAll((window) =>{
        chrome.tabs.query({windowId:window.id},tabs => {
          tabs = tabs.filter(tab => getDomain(tab.url) === getDomain(url));
          tabs = tabs.map(tab => tab.id);
          // console.log(tabs);
          chrome.tabs.move(tabs,{windowId : root.id,index:-1});
          chrome.tabs.remove(root.tabs[0].id); // REMOVE NEW TAB PAGE
        })
      });
    });
    
  });
}
