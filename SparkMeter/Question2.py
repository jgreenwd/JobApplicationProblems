# Response to Question 2:
# Find all the mistakes in this code snippet https://gitlab.com/-/snippets/2044716. Submit the fixed code here,
# with comments pointing out the fixes in a snippet of your own. Please create a public Github or Gitlab snippet with
# your response and submit the link here. *

import asyncio
import logging
import os                                                                   # required for getenv
from datetime import datetime                                               # required for datetime

logger = logging.getLogger(__name__)
logger.setLevel(10)                                                         # required to handle DEBUG level log events
ch = logging.StreamHandler()                                                # required to actually see the log events
logger.addHandler(ch)                                                       # required to actually see the log events
SLEEP_DURATION = os.getenv("SLEEP_DURATION")


class Pipeline:                                                             # __init__ must be synchronous
    def __init__(self, *args, **kwargs):                                    # add 'self' reference
        self.default_sleep_duration = kwargs["default_sleep_duration"]      # class scope requires 'self'

    async def sleep_for(self, coro, sleep_duration, *args, **kwargs):       # add 'self' reference
        await asyncio.sleep(sleep_duration)                                 # await sleep
        logger.info("Slept for %s seconds", sleep_duration)                 # remove indent
        start = datetime.now()
        coro(*args, **kwargs)                                               # typo: **kwarg -> **kwargs
        end = datetime.now()
        time_elapsed = (end - start).total_seconds()                        # swap end & start for positive value
        logger.debug(f"Executed the coroutine for {time_elapsed} seconds")
