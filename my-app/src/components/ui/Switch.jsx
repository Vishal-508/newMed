import styled from 'styled-components';

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:checked + ${Slider}:before {
    transform: translateX(26px);
  }
`;

const Switch = ({ checked, onChange }) => (
  <SwitchContainer>
    <Input type="checkbox" checked={checked} onChange={onChange} />
    <Slider />
  </SwitchContainer>
);

export default Switch;