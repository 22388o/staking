import initSynthetixJS, { NetworkId, Network, Token, Synth, SynthetixJS } from '@synthetixio/js';
import { ethers, Signer } from 'ethers';

import keyBy from 'lodash/keyBy';
import invert from 'lodash/invert';

export type Feed = {
	asset: string;
	category: string;
	description?: string;
	exchange?: string;
	feed?: string;
	sign: string;
};

export type SynthsMap = Record<string, Synth>;

export type TokensMap = Record<string, Token>;

type ContractSettings = {
	networkId: NetworkId;
	provider?: ethers.providers.Provider;
	signer?: Signer;
	useOvm?: boolean;
};

type Synthetix = {
	js: SynthetixJS | null;
	setContractSettings: (contractSettings: ContractSettings) => void;
	synthsMap: SynthsMap | null;
	tokensMap: TokensMap | null;
	synthSummaryUtil: ethers.Contract | null;
	chainIdToNetwork: Record<NetworkId, Network> | null;
};

const synthetix: Synthetix = {
	js: null,
	synthSummaryUtil: null,
	synthsMap: null,
	tokensMap: null,
	chainIdToNetwork: null,

	setContractSettings({ networkId, provider, signer, useOvm }: ContractSettings) {
		this.js = initSynthetixJS({
			networkId,
			provider,
			signer,
			useOvm,
		});

		this.synthsMap = keyBy(this.js.synths, 'name');
		this.tokensMap = keyBy(this.js.tokens, 'symbol');

		// @ts-ignore
		this.chainIdToNetwork = invert(this.js.networkToChainId);
	},
};

export type { Synth };
export default synthetix;
