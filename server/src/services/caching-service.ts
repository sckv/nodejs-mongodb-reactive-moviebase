import isEqual from 'fast-deep-equal';
import {CacheDigestableMessage} from 'types/cache';

import {hashUrl} from '@src/utils/hash-url';
import {jsonSafeParse} from '@src/utils/json-safe-parse';
import {logger} from '@src/utils/logger';
import {Cache} from '@src/redis';
import {CacheRepository} from '@src/pkg/storage/redis/cache.repository';

const RedisSubscription = Cache.duplicate();

export const cachingService = () => {
  RedisSubscription.on('message', async (channel, message) => {
    if (channel !== 'digest:cache') return;

    const {data, url} = jsonSafeParse<CacheDigestableMessage>(message);
    const hashedUrl = hashUrl(url);
    const oldEntry = await CacheRepository(Cache).getFromCache({key: hashedUrl});
    if (oldEntry && isEqual(oldEntry.data, data)) {
      //TODO: CHANGE FOR PINO
      logger.info('cache: cache:digest contents are the same', data, oldEntry);
      return;
    }

    await CacheRepository(Cache).setToCache({
      key: hashedUrl,
      data: {url, data},
    });
  });
  RedisSubscription.subscribe('digest:cache');
};
