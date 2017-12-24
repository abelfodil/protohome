"""This file contains cron-related functions."""

import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BackgroundScheduler()
scheduler.start()


def schedule(function_call, time, identifier='default_job', fullname='Default name'):
	"""This function calls another function each [time] minutes."""

	# call it once at the beginning
	function_call()

	scheduler.add_job(
		func=function_call,
		trigger=IntervalTrigger(minutes=time),
		id=identifier,
		name=fullname,
		replace_existing=True)


# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())
