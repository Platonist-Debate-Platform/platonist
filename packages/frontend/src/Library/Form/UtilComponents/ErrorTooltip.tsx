import { isArray } from 'lodash';
import React, { FunctionComponent, useState } from 'react';
import { Tooltip } from 'reactstrap';

export interface ErrorTooltipProps {
  error?: string | string[];
  formId: string;
  inputKey: string;
}

export const ErrorTooltip: FunctionComponent<ErrorTooltipProps> = ({
  error,
  formId,
  inputKey,
}) => {
  const targetId = `tooltip_${formId}_${inputKey}`;
  
  const [tooltipOpen, setTooltipOpen] = useState(false);
  
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <span className="error-tooltip" id={targetId}>
        <i className="fa fa-question-circle" />
      </span>
      <Tooltip isOpen={tooltipOpen} toggle={toggle} target={targetId}>
        {!isArray(error) ? (
          <>{error}</>
        ) : (
          <ul>
            {error.map((e, i) => 
              <li key={`error_${targetId}_${i}`}>{e}</li>
            )}
          </ul>
        )}
      </Tooltip>
    </>
  );
};