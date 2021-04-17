import styled from '@emotion/styled/macro';

const Description = styled.p`
  display: -webkit-box;
  -webkit-font-smoothing: antialiased;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0;
`;

export default Description;
