clear;






N=100;
u = linspace(-3,3,N);
[xx,yy]=meshgrid(u,u);

p = zeros(size(xx));
q = zeros(size(xx));
Vx = zeros(size(xx));
Vy = zeros(size(xx));
P = zeros(size(xx));

for ku=[1:N]
    for kv=[1:N]

        x = xx(ku,kv);
        y = yy(ku,kv);

        xu = (ku-1)/(N-1);
        yu = (kv-1)/(N-1);

        r = sqrt(x.^2+y.^2);
       
        e = [1,1]*([x,y]-[0,0])'; %'

        l1=1.5;
        l2=2.0;
        if(r<l1)
            p = e;
        end
        if(r>=l1 && r<l2)
            p = (1-(r-l1)/(l2-l1))*e;
        end
        if(r>=l2) 
            p = 0;
        end

        P(ku,kv) = p;
    end
end

[dPx,dPy] = gradient(P);
Vx = -dPy;
Vy =  dPx;


s=4;
quiver(xx(1:s:N,1:s:N),yy(1:s:N,1:s:N),Vx(1:s:N,1:s:N),Vy(1:s:N,1:s:N),'k','linewidth',2);


