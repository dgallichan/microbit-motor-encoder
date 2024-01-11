function sinusoidalSpeed () {
    currentSpeed = Math.sin(1 * 3.1415 * control.millis() / 10000)
    serial.writeValue("b.1", currentSpeed)
    if (input.buttonIsPressed(Button.A)) {
        if (currentSpeed > 0) {
            Kitronik_Robotics_Board.motorOn(Kitronik_Robotics_Board.Motors.Motor4, Kitronik_Robotics_Board.MotorDirection.Forward, maxSpeed * currentSpeed)
        } else {
            Kitronik_Robotics_Board.motorOn(Kitronik_Robotics_Board.Motors.Motor4, Kitronik_Robotics_Board.MotorDirection.Reverse, maxSpeed * (-1 * currentSpeed))
        }
    } else {
        Kitronik_Robotics_Board.allOff()
    }
    basic.pause(20)
}
input.onButtonPressed(Button.A, function () {
    PID_IntError = 0
})
let PID_DiffError = 0
let PID_lastError = 0
let PID_IntError = 0
let currentSpeed = 0
let targetAngle = 0
let maxSpeed = 0
maxSpeed = 100
let PID_Kp = 0.02
let PID_Ki = 0
let PID_Kd = 0
let currentAngle = Math.atan2(input.magneticForce(Dimension.X), input.magneticForce(Dimension.Y))
let PID_error = targetAngle - currentAngle
basic.forever(function () {
    currentAngle = Math.atan2(input.magneticForce(Dimension.X), input.magneticForce(Dimension.Y))
    serial.writeValue("a.1", currentAngle)
    PID_lastError = PID_error
    PID_error = targetAngle - currentAngle
    PID_DiffError = PID_lastError - PID_error
    PID_IntError = PID_IntError + PID_error
    currentSpeed = Math.constrain(PID_Kp * PID_error + PID_Ki * PID_IntError + PID_Kd * PID_DiffError, -1, 1)
    serial.writeValue("b.1", currentSpeed)
    if (currentSpeed > 0) {
        Kitronik_Robotics_Board.motorOn(Kitronik_Robotics_Board.Motors.Motor4, Kitronik_Robotics_Board.MotorDirection.Forward, maxSpeed * Math.sqrt(currentSpeed))
    } else {
        Kitronik_Robotics_Board.motorOn(Kitronik_Robotics_Board.Motors.Motor4, Kitronik_Robotics_Board.MotorDirection.Reverse, maxSpeed * Math.sqrt(-1 * currentSpeed))
    }
})
