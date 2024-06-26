// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RuntimeVersion } from '@polkadot/types/interfaces';

import React from 'react';

import { nodesGgxPNG } from '@polkadot/apps-config/ui/logos/nodes';
import { ChainImg, Icon, styled } from '@polkadot/react-components';
import { useApi, useCall, useIpfs, useToggle } from '@polkadot/react-hooks';
import { BestNumber, Chain } from '@polkadot/react-query';

import Endpoints from '../Endpoints/index.js';

interface Props {
  className?: string;
}

const RUNTIME_GGX_NODE_NAME = 'golden-gate-node';

function ChainInfo ({ className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(isApiReady && api.rpc.state.subscribeRuntimeVersion);
  const runtimeNodeVersionName = runtimeVersion?.specName.toString();
  const { ipnsChain } = useIpfs();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const canToggle = !ipnsChain;

  return (
    <StyledDiv className={className}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''} highlight--color-contrast`}
        onClick={toggleEndpoints}
      >
        {/** TODO: Will be changed later */}
        {runtimeNodeVersionName && (runtimeNodeVersionName === RUNTIME_GGX_NODE_NAME)
          ? <StyledImg
            className={'logo'}
            src={nodesGgxPNG as string}
          />
          : <ChainImg />
        }
        <div className='info media--1000'>
          <Chain className='chain' />
          {runtimeVersion && (
            <div className='runtimeVersion'>{runtimeVersion.specName.toString()}/{runtimeVersion.specVersion.toNumber()}</div>
          )}
          <BestNumber
            className='bestNumber'
            label='#'
          />
        </div>
        {canToggle && (
          <Icon
            className='dropdown'
            icon={isEndpointsVisible ? 'caret-right' : 'caret-down'}
          />
        )}
      </div>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints} />
      )}
    </StyledDiv>
  );
}

const imageBox = `
  background: white;
  border-radius: 50%;
  box-sizing: border-box;
  color: #333;
  display: inline-block;
  height: 40px;
  margin-right: 0.75rem;
  vertical-align: middle;
`;

const StyledImg = styled.img`${imageBox}`;

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 0;
  margin: 0;

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.isClickable {
      cursor: pointer;
    }

    .ui--ChainImg {
      height: 3rem;
      margin-right: 0.5rem;
      width: 3rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    .info {
      flex: 1;
      font-size: var(--font-size-tiny);
      line-height: 1.2;
      padding-right: 0.5rem;
      text-align: right;

      .chain {
        font-size: var(--font-size-small);
        max-width: 16rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .runtimeVersion {
        letter-spacing: -0.01em;
      }
    }
  }
`;

export default React.memo(ChainInfo);
