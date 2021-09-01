import React from "react";

const UserTyped = (props) => {
  const characterTyped = props.characterTyped;
  return (
    <div>
      <h1>Characters Typed</h1>
      <div>Total Tests Given - {characterTyped.total_test} </div>
      <div>Total Characters Typed -{characterTyped.total_character}</div>
      <div>A - {characterTyped.a} </div>
      <div>B - {characterTyped.b} </div>
      <div>C - {characterTyped.c} </div>
      <div>D - {characterTyped.d} </div>
      <div>E - {characterTyped.e} </div>
      <div>F - {characterTyped.f} </div>
      <div>G - {characterTyped.g} </div>
      <div>H - {characterTyped.h} </div>
      <div>I - {characterTyped.i} </div>
      <div>J - {characterTyped.j} </div>
      <div>K - {characterTyped.k} </div>
      <div>L - {characterTyped.l} </div>
      <div>M - {characterTyped.m} </div>
      <div>N - {characterTyped.n} </div>
      <div>O - {characterTyped.o} </div>
      <div>P - {characterTyped.p} </div>
      <div>Q - {characterTyped.q} </div>
      <div>R - {characterTyped.r} </div>
      <div>S - {characterTyped.s} </div>
      <div>T - {characterTyped.t} </div>
      <div>U - {characterTyped.u} </div>
      <div>V - {characterTyped.v} </div>
      <div>W - {characterTyped.w} </div>
      <div>X - {characterTyped.x} </div>
      <div>Y - {characterTyped.y} </div>
      <div>Z - {characterTyped.z} </div>
    </div>
  );
};

export default UserTyped;
