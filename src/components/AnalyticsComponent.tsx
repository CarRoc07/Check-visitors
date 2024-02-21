'use client'

import { analytics } from "@/utils/analytics"
import { BarChart, Card } from "@tremor/react"
import ReactCountryFlag from "react-country-flag"

interface AnalyticsDashboardProps {
    avgVisitorsPerDay:  string,
    visitorsToday: string,
    timeSeriesPageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>,
    topCountries: [string, number][]
}

const Badge = ({percentage}: {percentage: number}) => {
    const isPositive = percentage > 0;
    const isNeutral = percentage === 0;
    const isNegative = percentage < 0;

    if(isNaN(percentage)) return null;

    const positiveClassName = 'bg-green-900/25 text-green-400 ring-green-400/25'
    const neutralClassName = 'bg-gray-900/25 text-gray-400 ring-gray-400/25'
    const negativeClassName = 'bg-red-900/25 text-red-400 ring-red-400/25'

    const className = isPositive ? positiveClassName : isNeutral ? neutralClassName : isNegative ? negativeClassName : '';

    return (
        <span className={`inline-flex gap-1 items-center ml-2 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
            {percentage.toFixed(0)}%
        </span>
    )
}

const AnalyticsDashboardComponent = ({ avgVisitorsPerDay, visitorsToday, timeSeriesPageViews, topCountries }: AnalyticsDashboardProps) => {
    return (
        <div className="flex flex-col gap-6 ">
            <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="w-full mx-auto max-w-xs">
                    <p className="text-tremor-default text-dark-tremor-content">Avg. visitors/day</p>
                    <p className="text-3xl text-dark-tremor-content-strong font-semibold">
                        {avgVisitorsPerDay}
                    </p>
                </Card>
                <Card className="w-full mx-auto max-w-xs">
                    <p className="text-tremor-default text-dark-tremor-content">
                        Visitors today
                        <Badge percentage={(Number(visitorsToday) / Number(avgVisitorsPerDay) - 1) * 100} />
                    </p>
                    <p className="text-3xl text-dark-tremor-content-strong font-semibold">
                        {visitorsToday}
                    </p>
                </Card>
                {/* <Card className="w-full mx-auto max-w-xs">
                    <p className="text-tremor-default text-dark-tremor-content">Avg. exports/day</p>
                    <p className="text-3xl text-dark-tremor-content-strong font-semibold">
                        {visitorsToday}
                    </p>
                </Card>
                <Card className="w-full mx-auto max-w-xs">
                    <p className="text-tremor-default text-dark-tremor-content">Exports today</p>
                    <p className="text-3xl text-dark-tremor-content-strong font-semibold">
                        {visitorsToday}
                    </p>
                </Card> */}
            </div>
            <Card className="flex flex-col sm:grid grid-cols-4 gap-6">
                <h2 className="w-full text-dark-tremor-content-strong text-center sm:left-left font-semibold text-xl">
                    This weeks top visitors:
                </h2>
                <div className="cols-span-3 flex items-center justify-between flex-wrap gap-8">
                    {topCountries?.map(([countryCode, number]) => (
                        <div key={countryCode} className="flex items-center gap-3 text-dark-tremor-content-strong">
                            <p className="hidden sm:block text-tremor-content">
                                {countryCode}
                            </p>
                            <ReactCountryFlag className="text-5xl sm:text-3xl" svg countryCode={countryCode} />
                            <p className="text-tremor-content sm:text-dark-tremor-content-strong">
                                {number}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                {timeSeriesPageViews ? (
                    <BarChart allowDecimals={false} showAnimation data={
                        timeSeriesPageViews.map((item) => ({
                            name: item.date,
                            Visitors: item.events.reduce((acc, curr) => {
                                return acc + Object.values(curr)[0]!
                            }, 0),
                        }))
                    } 
                    categories={["Visitors"]}
                    index="name"
                    />
                ) : null}
            </Card>
        </div>
    )
}

export default AnalyticsDashboardComponent