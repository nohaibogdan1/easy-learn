// communicate with indexdb

import React, { useEffect, useState } from "react";

import useDb from "../db/useDb";

const Main = (): React.ReactElement => {
  const [data, setData] = useState<{ prop: string; id: number }>();

  const { get } = useDb();

  const cl = () => {
    const a = get();
    a.then((i) => {
      setData(i);
    });
  };

  return (
    <div>
      <div>Hello</div>

      <button onClick={cl}>Click</button>
      <div>{data?.prop}</div>
    </div>
  );
};

export default Main;
