/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/




var MovingObstacle = DynamicMesh.extend({
    Init: function(position, rotation, id, param, metadata) {
        this._super(position, rotation, id, param, metadata);
    },
    tick: function(dTime) {

        if ( this.mesh ) {

            var time = (new Date()).getTime();
            switch (this.movementType) {
                case MovingObstacleMovementTypeEnum.SineWaveX:
                    this.object3D.position.x = this.startPosition.x + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveY:
                    this.object3D.position.y = this.startPosition.y + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveZ:
                    this.object3D.position.z = this.startPosition.z + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveXY:
                    this.object3D.position.x = this.startPosition.x + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.y = this.startPosition.y + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveXZ:
                    this.object3D.position.x = this.startPosition.x + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.z = this.startPosition.z + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveYZ:
                    this.object3D.position.y = this.startPosition.y + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.z = this.startPosition.z + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveXYZ:
                    this.object3D.position.x = this.startPosition.x + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.y = this.startPosition.y + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.z = this.startPosition.z + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.SineWaveXYZ2:
                    this.object3D.position.x = this.startPosition.x + (Math.sin((time/1000.0)*this.speedMultiplier*0.9)*this.distanceMultiplier);
                    this.object3D.position.y = this.startPosition.y + (Math.sin((time/1000.0)*this.speedMultiplier)*this.distanceMultiplier);
                    this.object3D.position.z = this.startPosition.z + (Math.sin((time/1000.0)*this.speedMultiplier*1.1)*this.distanceMultiplier);
                    break;
                case MovingObstacleMovementTypeEnum.RotationX:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.x = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationY:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.y = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationZ:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.z = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationXY:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.x = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.y = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationXZ:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.x = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.z = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationYZ:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.y = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.z = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationXYZ:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.x = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.y = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.z = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    break;
                case MovingObstacleMovementTypeEnum.RotationXYZ2:
                    this.changeRotationNextTick = true;
                    this.object3D.rotation.x = ((time/1000.0)*this.speedMultiplier*0.9)%(Math.PI*2);
                    this.object3D.rotation.y = ((time/1000.0)*this.speedMultiplier)%(Math.PI*2);
                    this.object3D.rotation.z = ((time/1000.0)*this.speedMultiplier*1.1)%(Math.PI*2);
                    break;
                default:
                    this.changeRotationNextTick = true;
                    this.object3D.position.lerp(this.targetPosition, dTime*2);
                    this.object3D.rotation.lerp(this.targetRotation, dTime*20);
                    break;
            }


            //sw("this.object3D.rotation", this.object3D.rotation.ToString());
            // Trim rotations

// this.object3D.position.y = 1;
//
//                    this.changeRotationNextTick = true;
//                    this.rotation.x = 180;
//                    //this.rotation.y = 0;
//                    this.rotation.z = 0;

        }

        this._super(dTime);

        //this.UpdateRotation();

    }
});


