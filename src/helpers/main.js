const budgetData = null;

export const getDataFromStorage = () => {
  if (window.localStorage.getItem('budgetData') !== null) {
    return JSON.parse(window.localStorage.getItem('budgetData'));
  }

};

export const setDataToStorage = (data) => {
  let budgetData;

  // if (window.localStorage.getItem('budgetData') !== null) {
  //   let budgetData = JSON.parse(window.localStorage.getItem('params'));
  // }

  window.localStorage.setItem(
    'budgetData',
    JSON.stringify(data)
  );
};
