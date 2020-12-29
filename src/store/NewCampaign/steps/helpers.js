/* eslint arrow-body-style:0 */
export const getMinimalBugetToChannels = (channels, selectionPayload) => {
  return channels.map((channel) => {
    return {
      ...channel,
      minimal_budget: selectionPayload.budgets[channel.channel_uid],
    };
  });
};
