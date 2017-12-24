from flask_restful import Resource


class REST(Resource):
	def __init__(self, **kwargs):
		self._database = kwargs['database']
		self._home = kwargs['home']
