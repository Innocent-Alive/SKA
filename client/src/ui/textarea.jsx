import React from "react";
import styled from "styled-components";

const TextAreaGroup = styled.div`
  font-family: "Nunito", "serif";
  margin: 1em 0;
  position: relative;
`;

const TextArea = styled.textarea`
  font-size: 100%;
  padding: 0.8em;
  outline: none;
  border-bottom: 1px solid #000080;
  background-color: transparent;
  width: 100%;
  min-height: 100px;
  line-height: 20px;
  transition: border-color 0.3s ease;
  resize: vertical;
  &:focus,
  &:valid {
    border-color: hsl(26.53, 86.98%, 66.86%);
  }
`;

const Label = styled.label`
  font-size: 90%;
  position: absolute;
  left: 0;
  bottom: 1rem;
  padding: 0.8em;
  margin-left: 0.5em;
  pointer-events: none;
  transition: all 0.3s ease;
  color: #000080;

  ${TextArea}:focus ~ &,
  ${TextArea}:valid ~ & {
    transform: translateY(-410%) scale(0.9);
    margin: 0;
    margin-left: -0.8em;
    padding: 0em 0.5em 0em 0.5em;
    background-color: transparent;
    color: hsl(26.53, 86.98%, 66.86%);
    font-weight: 700;
  }
`;

const TextAreaInput = ({ label, ...props }) => {
  return (
    <TextAreaGroup>
      <TextArea {...props} required autoComplete="off" />
      <Label>{label}</Label>
    </TextAreaGroup>
  );
};

export default TextAreaInput;
