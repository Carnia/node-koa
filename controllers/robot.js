
module.exports= {
	"GET /robot.txt":async  (ctx,next)=>{
		ctx.body=`User-agent: *
			Disallow: /`
		next()
	},	 
};

