import React from "react";
import styled from "styled-components";

const InputGroup = styled.div`
  font-family: "Nunito", "serif";
  margin: 1em 0;
  position: relative;
`;

const Input = styled.input`
  font-size: 100%;
  padding: 0.8em 0.1em;
  outline: none;
  font-weight: 500;
  border-bottom: 1px solid hsl(266, 100%, 13%);
  background-color: transparent;
  width: 100%;
  transition: border-color 0.3s ease;
  margin-bottom: 10px;
  &:focus {
    border-color: hsl(41, 100%, 62%);
  }
  &:valid {
    border-color: hsl(266, 100%, 13%);
  }
  &:hover {
    border-color: hsl(41, 100%, 62%);
  }
`;

const Label = styled.label`
  font-size: 90%;
  position: absolute;
  left: 0;
  padding: 0.8em;
  margin-left: 0.5em;
  pointer-events: none;
  transition: all 0.3s ease;
  color: hsl(266, 100%, 13%);

  ${Input}:focus ~ & {
    transform: translateY(-75%) scale(0.9);
    margin: 0;
    margin-left: -1em;
    margin-bottom: 2px;
    padding: 0em 0.5em 0em 0.5em;
    background-color: transparent;
    color: hsl(41, 100%, 62%);
    font-weight: 700;
  }
  ${Input}:valid ~ & {
    transform: translateY(-75%) scale(0.9);
    margin: 0;
    margin-left: -1em;
    margin-bottom: 2px;
    padding: 0em 0.5em 0em 0.5em;
    background-color: transparent;
    color: hsl(266, 100%, 13%);
    font-weight: 700;
  }
  ${Input}:hover ~ & {
    transform: translateY(-75%) scale(0.9);
    margin: 0;
    margin-left: -1em;
    margin-bottom: 2px;
    padding: 0em 0.5em 0em 0.5em;
    background-color: transparent;
    color: hsl(41, 100%, 62%);
    font-weight: 700;
  }
`;

const TextInput = ({ label, ...props }) => {
  return (
    <InputGroup>
      <Input {...props} required autoComplete="off" />
      <Label>{label}</Label>
    </InputGroup>
  );
};

export default TextInput;
