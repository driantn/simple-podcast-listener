import styled from '@emotion/styled/macro';

const Progress = styled.p<{ progress: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0%;
  z-index: 0;
  margin-bottom: 0;
  background: ${({ progress }) =>
    progress
      ? `linear-gradient(to right, #6c757d ${progress}%, transparent ${progress}%)`
      : 'none'};
  opacity: 0.2;
`;

export default Progress;
