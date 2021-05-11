import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { LineSpacer, StatsSection } from 'styles/common';

import { formatFiatCurrency, formatPercent, zeroBN } from 'utils/formatters/number';

import Main from 'sections/staking';
import useStakingCalculations from 'sections/staking/hooks/useStakingCalculations';

import useSelectedPriceCurrency from 'hooks/useSelectedPriceCurrency';

import { isWalletConnectedState } from 'store/wallet';

import StatBox from 'components/StatBox';
import ProgressBar from 'components/ProgressBar';

const StakingPage = () => {
	const { t } = useTranslation();
	const {
		stakedCollateralValue,
		percentageCurrentCRatio,
		debtBalance,
		percentCurrentCRatioOfTarget,
	} = useStakingCalculations();
	const { selectedPriceCurrency, getPriceAtCurrentRate } = useSelectedPriceCurrency();
	const isWalletConnected = useRecoilValue(isWalletConnectedState);

	return (
		<>
			<Head>
				<title>{t('staking.page-title')}</title>
			</Head>
			<StatsSection>
				<StakedValue
					title={t('common.stat-box.staked-value')}
					value={formatFiatCurrency(
						getPriceAtCurrentRate(!stakedCollateralValue ? zeroBN : stakedCollateralValue),
						{
							sign: selectedPriceCurrency.sign,
						}
					)}
				/>
				<CRatio
					title={t('common.stat-box.c-ratio')}
					value={isWalletConnected ? formatPercent(percentageCurrentCRatio) : '-%'}
					size="lg"
				>
					<CRatioProgressBar
						variant="blue-pink"
						percentage={!percentCurrentCRatioOfTarget ? 0 : percentCurrentCRatioOfTarget.toNumber()}
					/>
				</CRatio>
				<ActiveDebt
					title={t('common.stat-box.active-debt')}
					value={formatFiatCurrency(getPriceAtCurrentRate(!debtBalance ? zeroBN : debtBalance), {
						sign: selectedPriceCurrency.sign,
					})}
				/>
			</StatsSection>
			<LineSpacer />
			<Main />
		</>
	);
};

const StakedValue = styled(StatBox)`
	.title {
		color: ${(props) => props.theme.colors.blue};
	}
`;
const CRatio = styled(StatBox)`
	.value {
		text-shadow: ${(props) => props.theme.colors.blueTextShadow};
		color: ${(props) => props.theme.colors.black};
	}
`;
const ActiveDebt = styled(StatBox)`
	.title {
		color: ${(props) => props.theme.colors.pink};
	}
`;

export const CRatioProgressBar = styled(ProgressBar)`
	height: 6px;
	width: 100%;
	transform: translateY(12px);
	// match StatBox "lg" background size width
	max-width: 176px;
`;

export default StakingPage;
