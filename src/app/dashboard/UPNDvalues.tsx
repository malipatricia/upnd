'use client'

export default function UPNDValues(){
    return(
      <div className="bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Unity</h3>
              <p className="text-white/90 text-sm">Bringing together all Zambians regardless of background</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Work</h3>
              <p className="text-white/90 text-sm">Promoting hard work and sustainable development</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Progress</h3>
              <p className="text-white/90 text-sm">Advancing progressive policies for transformation</p>
            </div>
          </div>
        </div>
      </div>
    )
}