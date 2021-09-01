import React from "react";

const UserTimes = (props) => {
  const testTimes = props.testTimes;
  return (
    <div>
      <h1>Typing Time</h1>
      <div>Total Time -{testTimes.total_time} seconds</div>

      <div>A - {testTimes.a} seconds</div>
      <div>B - {testTimes.b} seconds</div>
      <div>C - {testTimes.c} seconds</div>
      <div>D - {testTimes.d} seconds</div>
      <div>E - {testTimes.e} seconds</div>
      <div>F - {testTimes.f} seconds</div>
      <div>G - {testTimes.g} seconds</div>
      <div>H - {testTimes.h} seconds</div>
      <div>I - {testTimes.i} seconds</div>
      <div>J - {testTimes.j} seconds</div>
      <div>K - {testTimes.k} seconds</div>
      <div>L - {testTimes.l} seconds</div>
      <div>M - {testTimes.m} seconds</div>
      <div>N - {testTimes.n} seconds</div>
      <div>O - {testTimes.o} seconds</div>
      <div>P - {testTimes.p} seconds</div>
      <div>Q - {testTimes.q} seconds</div>
      <div>R - {testTimes.r} seconds</div>
      <div>S - {testTimes.s} seconds</div>
      <div>T - {testTimes.t} seconds</div>
      <div>U - {testTimes.u} seconds</div>
      <div>V - {testTimes.v} seconds</div>
      <div>W - {testTimes.w} seconds</div>
      <div>X - {testTimes.x} seconds</div>
      <div>Y - {testTimes.y} seconds</div>
      <div>Z - {testTimes.z} seconds</div>
    </div>
  );
};

export default UserTimes;
