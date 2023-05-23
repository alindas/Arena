import { useEffect, useLayoutEffect } from "react";

// 父组件
export default function App() {
  console.log("【父组件】 主线程 ---------- ");

  useLayoutEffect(() => {
    console.log("【父组件】 LayoutEffect 副作用 --- ");

  }, []);

  useEffect(() => {
    console.log("【父组件】 Effect 副作用 --- ");

  }, []);

  return (
    <div>
      {console.log("【父组件】return --- ")}
      <h1>父组件</h1>
      <Com1 />
      <Com2 />
    </div>
  );
}

// 子组件1
function Com1() {
  console.log("【子1组件】 主线程 ---------- ");

  useEffect(() => {
    console.log("【子1组件】 副作用 --- ");
  }, []);

  return (
    <div>
      {console.log("【子1组件】return --- ")}
      <h2>子1组件</h2>
    </div>
  );
}

// 子组件2
function Com2() {
  console.log("【子2组件】 主线程 ---------- ");

  useEffect(() => {
    console.log("【子2组件】 副作用 --- ");
  });

  return (
    <div>
      {console.log("【子2组件】return --- ")}
      <h2>子2组件</h2>
      <Com3 />
    </div>
  );
}

// 孙组件
function Com3() {
  console.log("【孙组件】 主线程 ---------- ");

  useEffect(() => {
    console.log("【孙组件】 副作用 --- ");
  }, );

  return (
    <div>
      {console.log("【孙组件】return --- ")}
      <h3>孙组件</h3>
    </div>
  );
}
