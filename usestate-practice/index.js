const createState = (number) => { //整體寫法現在不好讀，可以改用class去包裝state
  let state = number;
  const publicState = document.getElementById('public-state');
  publicState.textContent = `共用狀態: ${state}`; // 初始化共用狀態文字
  const observers = []; // 初始化觀察者列表

  const setState = (newState) => {
    state = newState;
    const publicState = document.getElementById('public-state');
    publicState.textContent = `共用狀態: ${state}`; // 更新共用狀態文字
    observers.forEach((observer) => { observer(state); }); //用callback function比較容易定義行為
  };

  const getState = () => {
    return state;
  };

  const subscribe = (observer) => {
    if (observers.includes(observer)) {
      return () => {
        const index = observers.indexOf(observer);
        if (index > -1) {
          observers.splice(index, 1);
        }
      };
    }
    observers.push(observer);
    return () => {
      const index = observers.indexOf(observer);
      if (index > -1) {
        observers.splice(index, 1);
      }
    };
  };

  return {
    setState,
    getState,
    subscribe,
  };

};
const initialState = 0;
const appState = createState(initialState); // 初始值為 0

//區塊一
const container1 = document.getElementById('container1');

container1.querySelector('#container1-text').textContent = `container1: ${initialState}`;
//區塊一加入了重新追蹤改變的方法
const container1Observer = (newState) => {
  console.log('container1', newState);
  container1.querySelector('#container1-text').textContent = `container1: ${newState}`;
};

let unSubscribeContainer1;
unSubscribeContainer1 = appState.subscribe(container1Observer);

document.getElementById('container1-subscribe-button').addEventListener('click', () => {
  console.log('container1-subscribe');
  unSubscribeContainer1 = appState.subscribe(container1Observer);
});

document.getElementById('container1-unsubscribe-button').addEventListener('click', () => {
  console.log('container1-unsubscribe');
  unSubscribeContainer1();
});

//區塊二
const container2 = document.getElementById('container2');

container2.querySelector('#container2-text').textContent = `container2: ${initialState}`;

const unSubscribeContainer2 = appState.subscribe((newState) => {
  console.log('container2', newState);
  container2.querySelector('#container2-text').textContent = `container2: ${newState}`;
});

document.getElementById('container2-unsubscribe-button').addEventListener('click', () => {
  console.log('container2-unsubscribe');
  unSubscribeContainer2();
});

//改變共同狀態
document.getElementById('increment').addEventListener('click', () => {
  console.log('increment');
  appState.setState(Number(appState.getState()) + 1);
});





