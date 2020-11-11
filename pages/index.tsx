import React, { useMemo } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';

import { FlexDivCol } from 'styles/common';
import { PossibleActions, BarStats } from 'sections/dashboard';

import useGetDebtDataQuery from 'queries/debt/useGetDebtDataQuery';
import useFeeClaimHistoryQuery from 'queries/staking/useFeeClaimHistoryQuery';
import useGetFeePoolDataQuery from 'queries/staking/useGetFeePoolDataQuery';

const DashboardPage = () => {
	const { t } = useTranslation();
	const debtDataQuery = useGetDebtDataQuery();

	const history = useFeeClaimHistoryQuery();

	const currentFeePeriod = useGetFeePoolDataQuery('0');

	const currentCRatio = debtDataQuery.data?.currentCRatio ?? 0;
	const targetCRatio = debtDataQuery.data?.targetCRatio ?? 0;

	// TODO: replace with useMemo
	// eslint-disable-next-line
	const nextFeePeriodStarts = new Date(
		currentFeePeriod.data?.startTime
			? (currentFeePeriod.data.startTime + currentFeePeriod.data.feePeriodDuration) * 1000
			: 0
	);

	// TODO: replace with useMemo
	// eslint-disable-next-line
	const currentFeePeriodStarts = new Date(
		currentFeePeriod.data?.startTime ? currentFeePeriod.data.startTime * 1000 : 0
	);

	// TODO: replace with useMemo
	// eslint-disable-next-line
	const currentFeePeriodProgress = currentFeePeriod.data?.startTime
		? (Date.now() / 1000 - currentFeePeriod.data.startTime) /
		  currentFeePeriod.data.feePeriodDuration
		: 0;

	const checkClaimedStatus = useMemo(
		() =>
			history.data
				? history.data?.some((tx) => {
						const claimedDate = new Date(tx.timestamp);
						return claimedDate > currentFeePeriodStarts && claimedDate < nextFeePeriodStarts;
				  })
				: false,
		[history, currentFeePeriodStarts, nextFeePeriodStarts]
	);

	const claimed = checkClaimedStatus;

	return (
		<Content>
			<Head>
				<title>{t('dashboard.page-title')}</title>
			</Head>
			<BarStats
				currentCRatio={currentCRatio}
				targetCRatio={targetCRatio}
				claimed={claimed}
				nextFeePeriodStarts={nextFeePeriodStarts}
				currentFeePeriodProgress={currentFeePeriodProgress}
			/>
			<PossibleActions claimAmount={20} sUSDAmount={2000} SNXAmount={400} earnPercent={0.15} />
		</Content>
	);
};

const Content = styled(FlexDivCol)`
	width: 100%;
	max-width: 1200px;
`;

export default DashboardPage;
