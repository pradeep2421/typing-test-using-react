import React from "react";

const UserSpeed = (props) => {
  const speeds = props.speed;
  return (
    <div>
      <h1>User Speeds</h1>
      <div>HIGHEST SPEED - {speeds.highest} WPM</div>
      <div>LOWEST SPEED - {speeds.lowest} WPM</div>
      <div>AVERAGE SPEED - {speeds.average} WPM</div>
      <div>A - {speeds.a} WPM</div>
      <div>B - {speeds.b} WPM</div>
      <div>C - {speeds.c} WPM</div>
      <div>D - {speeds.d} WPM</div>
      <div>E - {speeds.e} WPM</div>
      <div>F - {speeds.f} WPM</div>
      <div>G - {speeds.g} WPM</div>
      <div>H - {speeds.h} WPM</div>
      <div>I - {speeds.i} WPM</div>
      <div>J - {speeds.j} WPM</div>
      <div>K - {speeds.k} WPM</div>
      <div>L - {speeds.l} WPM</div>
      <div>M - {speeds.m} WPM</div>
      <div>N - {speeds.n} WPM</div>
      <div>O - {speeds.o} WPM</div>
      <div>P - {speeds.p} WPM</div>
      <div>Q - {speeds.q} WPM</div>
      <div>R - {speeds.r} WPM</div>
      <div>S - {speeds.s} WPM</div>
      <div>T - {speeds.t} WPM</div>
      <div>U - {speeds.u} WPM</div>
      <div>V - {speeds.v} WPM</div>
      <div>W - {speeds.w} WPM</div>
      <div>X - {speeds.x} WPM</div>
      <div>Y - {speeds.y} WPM</div>
      <div>Z - {speeds.z} WPM</div>
    </div>
  );
};

export default UserSpeed;
