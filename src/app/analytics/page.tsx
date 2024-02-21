import AnalyticsDashboardComponent from '@/components/AnalyticsComponent';
import { analytics } from '@/utils/analytics';
import React from 'react'

const Page = async () => {
    const TRACK_DAYS = 7

    const pageviews = await analytics.retrieveDays('pageview', TRACK_DAYS)

    const totalViews = pageviews.reduce((acc, curr) => {
        return acc + curr.events.reduce((acc, curr) => {
            return acc + Object.values(curr)[0]!
        }, 0);
    }, 0)

    const avgVisitorsPerDay = (totalViews / TRACK_DAYS).toFixed(1)

    const visitorsToday = pageviews[pageviews.length - 1].events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!;
    }, 0)

    const topCountriesMap = new Map<string, number>();

    for (let i = 0; i < pageviews.length; i++) {
        const day = pageviews[i];
        if(!day) continue;

        for (let j = 0; j < day.events.length; j++) {
            const event = day.events[j];
            if(!event) continue;

            const key = Object.keys(event)[0]!
            const value = Object.values(event)[0]!

            const parsedKey = JSON.parse(key)
            const country = parsedKey?.country;
            if(country){
                if(topCountriesMap.has(country)){
                    topCountriesMap.set(country, topCountriesMap.get(country)! + value)
                } else {
                    topCountriesMap.set(country, value)
                }
            }

        }
    }

    const topCountries = [...topCountriesMap.entries()].sort((a, b) => {
        if(a[1]! > b[1]!) return -1;
        else return 1
    }).slice(0, 5)

    return (
        <div className='min-h-screen w-full py-12 flex justify-center items-center'>
            <div className='relative w-full max-w-6xl mx-auto text-white'>
                <AnalyticsDashboardComponent 
                avgVisitorsPerDay={avgVisitorsPerDay} 
                visitorsToday={visitorsToday.toString()}
                timeSeriesPageViews={pageviews}
                topCountries={topCountries}
                />
            </div>
        </div>
    )
}

export default Page;