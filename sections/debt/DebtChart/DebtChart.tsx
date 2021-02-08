import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ThemeContext } from 'styled-components';
import numbro from 'numbro';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ReferenceLine,
} from 'recharts';
import { formatCurrency } from 'utils/formatters/number';
import { Synths } from 'constants/currency';

const LEGEND_LABELS = {
	actualDebt: 'debt.actions.track.tooltip.info.actualDebt',
	issuanceDebt: 'debt.actions.track.tooltip.info.issuedDebt',
};

type Payload = {
	color: string;
	name: keyof typeof LEGEND_LABELS;
	value: number;
}

interface CustomTooltipProps {
	active?: boolean,
	payload?: Payload[],
	label?: Date,
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	const { t } = useTranslation();
	if (!active || !label) return null;

	return (
		<TooltipWrapper>
			<StyledH5>{format(new Date(label), 'MMM dd YYY, h:mma')}</StyledH5>
			<Legend>
				{payload?.map(({ color, name, value }) => {
					return (
						<LegendRow key={`legend-${name}`}>
							<LegendName>
								<LegendIcon style={{ backgroundColor: color }} />
								<LegendText>{t(LEGEND_LABELS[name])}</LegendText>
							</LegendName>
							<LegendText>{`${formatCurrency(Synths.sUSD, value)} sUSD`}</LegendText>
						</LegendRow>
					);
				})}
			</Legend>
		</TooltipWrapper>
	);
};

type Data = {
	issuanceDebt: number
	actualDebt: number
}

const DebtChart = ({ data }: { data: Data[] }) => {
	const { colors, fonts } = useContext(ThemeContext);
	if (!data || data.length === 0) return null;
	return (
		<ResponsiveContainer width="100%" height={270}>
			<LineChart margin={{ left: 0, top: 20, bottom: 0, right: 5 }} data={data}>
				<XAxis
					height={20}
					dataKey="timestamp"
					interval="preserveEnd"
					tick={{ fontSize: 12, fill: colors.gray, fontFamily: fonts.regular }}
					axisLine={false}
					tickLine={false}
					tickFormatter={tick => format(new Date(tick), 'd MMM yy')}
				/>
				<YAxis
					width={35}
					stroke={colors.white}
					domain={['auto', 'auto']}
					tickLine={false}
					strokeWidth={1}
					tickFormatter={tick => numbro(tick).format({ average: true })}
					tick={{ fontSize: 12, fill: colors.gray, fontFamily: fonts.interSemiBold }}
				/>
				<Tooltip
					cursor={{ stroke: colors.white }}
					content={<CustomTooltip />}
					contentStyle={{
						opacity: 1,
						backgroundColor: colors.navy,
						zIndex: 1000,
						borderColor: colors.navy,
					}}
				/>
				<Line type="monotone" dataKey="issuanceDebt" stroke={colors.blue} strokeWidth={2} dot={false} />
				<Line type="monotone" dataKey="actualDebt" stroke={colors.pink} strokeWidth={2} dot={false} />
				<ReferenceLine y={0} isFront={false} strokeWidth={1} stroke={colors.grayBlue} />
			</LineChart>
		</ResponsiveContainer>
	);
};

const TooltipWrapper = styled.div`
	width: 250px;
	background-color: ${props => props.theme.colors.grayBlue};
	border: 1px solid ${props => props.theme.colors.grayBlue};
	border-radius: 2px;
	padding: 0 16px 16px 16px;
	text-align: left;
`;

const StyledH5 = styled.h5`
	font-size: 14px;
	text-transform: none;
`;

const Legend = styled.div`
	width: 100%;
`;

const LegendRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const LegendName = styled.div`
	display: flex;
	align-items: center;
`;

const LegendIcon = styled.div`
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
	margin-right: 8px;
`;

const LegendText = styled.span`
	font-family: ${props => props.theme.fonts.regular};
	font-size: 12px;
	color: ${props => props.theme.colors.white};
`;
export default DebtChart;