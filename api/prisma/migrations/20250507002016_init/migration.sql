-- CreateTable
CREATE TABLE "CampaignChannel" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "keyboardMode" TEXT NOT NULL DEFAULT 'inline',
    "campaignId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "CampaignChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "textLimit" INTEGER,
    "standardButtons" INTEGER NOT NULL DEFAULT 0,
    "inlineButtons" INTEGER NOT NULL DEFAULT 0,
    "labelMaxLength" INTEGER,
    "inlineLabelMaxLength" INTEGER,
    "supportsUrl" BOOLEAN NOT NULL DEFAULT false,
    "supportsQuickReply" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChannelDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Button" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'quick_reply',
    "payload" TEXT,
    "campaignChannelId" TEXT NOT NULL,

    CONSTRAINT "Button_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignChannel_campaignId_channelId_key" ON "CampaignChannel"("campaignId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelDefinition_name_key" ON "ChannelDefinition"("name");

-- AddForeignKey
ALTER TABLE "CampaignChannel" ADD CONSTRAINT "CampaignChannel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignChannel" ADD CONSTRAINT "CampaignChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ChannelDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_campaignChannelId_fkey" FOREIGN KEY ("campaignChannelId") REFERENCES "CampaignChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
