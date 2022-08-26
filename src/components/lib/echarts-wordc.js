module.exports=async(echarts)=>{

    (await import("./echarts-wordcloud/WordCloudSeries")).default(echarts);

    (await import("./echarts-wordcloud/WordCloudView")).default(echarts);

    const wordCloudLayoutHelper=(await import("./echarts-wordcloud/layout")).default;

    (await import("./echarts-wordcloud/wordCloud")).default(echarts,wordCloudLayoutHelper);

}